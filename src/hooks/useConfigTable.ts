import type { AnyAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type FunctionType = <T>(item: T) => AnyAction;

const useConfigTable = (func?: FunctionType) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onView = (id: number | string) => () => {
    navigate(`view/${id}`);
  };

  const onEdit = (id: number | string) => () => {
    navigate(`edit/${id}`);
  };

  const onDelete =
    <T>(item: T) =>
    () => {
      if (!func) return;
      dispatch(func(item));
    };

  return { onView, onEdit, onDelete };
};

export default useConfigTable;
