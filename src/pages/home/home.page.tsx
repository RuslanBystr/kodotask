'use client';

import { ArrowRight, Clock, ListChecks, PlusIcon, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { IProjectFormParams } from '@/components/forms/project/ProjectForm';
import { UnderlinedText } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useCreateProjectMutation, useGetProjectsQuery } from '@/services/project';

// simple debounce hook
function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

export default function HomePage() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();

  const [q, setQ] = useState('');
  const debouncedQ = useDebounce(q);

  const searchRef = useRef<HTMLInputElement>(null);

  const {
    data: projectsResp,
    isLoading,
    isFetching,
  } = useGetProjectsQuery({ limit: 6, page: 1, sortBy: '-createdAt' }, { refetchOnMountOrArgChange: true });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recentProjects = projectsResp?.items ?? [];

  const filteredProjects = useMemo(() => {
    const s = debouncedQ.trim().toLowerCase();
    if (!s) return recentProjects;

    return recentProjects.filter((p) => [p.name, p.description].some((v) => (v ?? '').toLowerCase().includes(s)));
  }, [debouncedQ, recentProjects]);

  const [openCreate, setOpenCreate] = useState(false);
  const [createBody, setCreateBody] = useState<Partial<IProjectFormParams>>({
    name: '',
    description: '',
  });

  const [createProject, { isLoading: creating }] = useCreateProjectMutation();

  const resetForm = () => setCreateBody({ name: '', description: '' });

  const onCreate = async () => {
    const name = createBody.name?.trim();

    if (!name) {
      toast.error('Name is required');
      return;
    }

    try {
      const res = await createProject({
        name,
        description: createBody.description?.trim() || '',
      }).unwrap();

      toast.success('Project created');

      resetForm();
      setOpenCreate(false);

      navigate(`/projects/${res.id}`);
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  // scoped keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (isTyping) return;

      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if (e.key.toLowerCase() === 'c') {
        setOpenCreate(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const formatDate = (value?: string) => {
    if (!value) return '—';

    const d = new Date(value);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(d.getTime())) return '—';

    return d.toLocaleString();
  };

  return (
    <div className="w-full h-screen p-6 md:p-8 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        {isMobile && <SidebarTrigger className="-ml-1" />}

        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button className="bg-[--main-button] hover:bg-[--main-button-hover] rounded-none">
              <PlusIcon className="w-4 h-4 mr-2" />
              New project
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[480px] bg-[#465c70]">
            <DialogHeader>
              <DialogTitle>Create project</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={createBody.name ?? ''}
                  onChange={(e) =>
                    setCreateBody((s) => ({
                      ...s,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  value={createBody.description ?? ''}
                  onChange={(e) =>
                    setCreateBody((s) => ({
                      ...s,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={onCreate}
                disabled={creating}
                className="bg-[--main-button] hover:bg-[--main-button-hover]"
              >
                {creating ? 'Creating…' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Quick search
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input ref={searchRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search… (/)" />

            {(isFetching || isLoading) && <div className="text-xs opacity-60 mt-1">Searching…</div>}
          </CardContent>
        </Card>

        <Card className="bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" /> Quick actions
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setOpenCreate(true)} className="bg-[--main-button]">
              Create project
            </Button>

            <Button size="sm" asChild>
              <Link to="/projects">All projects</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-accent/10">
          <CardHeader className="flex justify-between">
            <CardTitle>Recent projects</CardTitle>

            <Button size="sm" variant="ghost" asChild>
              <Link to="/projects">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent>
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
              <div className="text-sm opacity-70">Loading…</div>
            ) : filteredProjects.length ? (
              <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredProjects.map((p) => (
                  <li key={p.id} className="rounded-xl border hover:bg-white/5 transition">
                    <Link to={`/projects/${p.id}`} className="block p-3">
                      <div className="font-medium truncate">{p.name}</div>

                      <div className="text-xs opacity-70 line-clamp-2">{p.description}</div>

                      <Separator className="my-2" />

                      <div className="text-xs opacity-60">Updated: {formatDate(p.createdAt)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm opacity-70">No projects yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-accent/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Activity
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm opacity-80">Coming soon…</CardContent>
        </Card>
      </div>

      <Card className="bg-accent/10">
        <CardHeader>
          <CardTitle>
            <UnderlinedText>Assigned to me</UnderlinedText>
          </CardTitle>
        </CardHeader>

        <CardContent>{/* future */}</CardContent>
      </Card>
    </div>
  );
}
