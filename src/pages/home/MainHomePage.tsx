import { ArrowRight, Clock, ListChecks, PlusIcon, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { IProjectFormParams } from '@/components/forms/project/ProjectForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useCreateProjectMutation, useGetProjectsQuery } from '@/services/project';

export default function HomePage() {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  // Recent projects
  const { data: projectsResp, isLoading } = useGetProjectsQuery({ limit: 6, page: 1, sortBy: '-createdAt' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recentProjects = projectsResp?.items ?? [];

  const [q, setQ] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const filteredProjects = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recentProjects;
    return recentProjects.filter((p) => [p.name, p.description].some((v) => (v ?? '').toLowerCase().includes(s)));
  }, [q, recentProjects]);

  // Create project
  const [openCreate, setOpenCreate] = useState(false);
  const [createBody, setCreateBody] = useState<Partial<IProjectFormParams>>({ name: '', description: '' });
  const [createProject, { isLoading: creating }] = useCreateProjectMutation();

  // eslint-disable-next-line consistent-return
  const onCreate = async () => {
    if (!createBody.name?.trim()) return toast.error('Name is required');
    try {
      const res = await createProject(createBody as IProjectFormParams).unwrap();
      toast.success('Project created');
      setOpenCreate(false);
      setCreateBody({ name: '', description: '' });
      navigate(`/projects/${res.id}`);
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key.toLowerCase() === 'c') {
        setOpenCreate(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="w-full h-full p-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        <div className="pt-4">
          <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex gap-2">
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
                  <Label htmlFor="pname">Name</Label>
                  <Input
                    id="pname"
                    placeholder="Project name"
                    value={createBody.name ?? ''}
                    onChange={(e) => setCreateBody((s) => ({ ...s, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pdesc">Description</Label>
                  <Input
                    id="pdesc"
                    placeholder="Short description"
                    value={createBody.description ?? ''}
                    onChange={(e) => setCreateBody((s) => ({ ...s, description: e.target.value }))}
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
      </div>

      {/* Search + Quick actions */}
      <div className="grid container grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Search className="w-4 h-4" /> Quick search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search recent projects…  ( / )"
              className="rounded-xl"
            />
            <p className="text-xs opacity-60">
              Press <kbd className="px-1 py-0.5 rounded bg-white/10">/</kbd> to focus,{' '}
              <kbd className="px-1 py-0.5 rounded bg-white/10">c</kbd> to create
            </p>
          </CardContent>
        </Card>

        <Card className="bg-accent/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" /> Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              className="bg-[--main-button] border-none rounded-none"
              size="sm"
              variant="outline"
              onClick={() => setOpenCreate(true)}
            >
              Create project
            </Button>
            <Button className="bg-[--main-button] border-none rounded-none" size="sm" variant="outline" asChild>
              <Link to="/projects">All projects</Link>
            </Button>
            {/* other quick actions */}
          </CardContent>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Projects */}
        <Card className="lg:col-span-2 bg-accent/10">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>Recent projects</CardTitle>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/projects" className="flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
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
                      <div className="text-base font-medium truncate">{p.name}</div>
                      <div className="text-xs opacity-70 line-clamp-2">{p.description}</div>
                      <Separator className="my-2" />
                      <div className="text-xs opacity-60">Updated: {new Date(p.createdAt).toLocaleString()}</div>
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
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm opacity-80">
            <p>Activity feed coming soon.</p>
            <p className="opacity-60">Later...</p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-accent/10">
        <CardHeader className="pb-2">
          <CardTitle>Assigned to me</CardTitle>
        </CardHeader>
        <CardContent>{}</CardContent>
      </Card>
    </div>
  );
}
