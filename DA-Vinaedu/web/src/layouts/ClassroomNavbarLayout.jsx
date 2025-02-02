import api from '@/core/api';
import { NoDataView } from '@/shared/components';
import { useAuth } from '@/shared/hooks';
import { A, useLocation, useNavigate, useParams } from '@solidjs/router';
import { FiArrowLeft } from 'solid-icons/fi';
import {
  createContext,
  createMemo,
  createResource,
  ErrorBoundary,
  Match,
  Switch,
  useContext,
} from 'solid-js';

const ClassroomContext = createContext();

const getClassroom = async id => {
  const data = await api.get(`classroom/${id}`);
  return data;
};

const getLessons = async id => {
  try {
    const data = await api.get('lesson', { params: { classroomId: id } });
    return data;
  } catch (error) {
    return [];
  }
};

const getStudents = async ({ id, isOwner }) => {
  if (!isOwner) return [];
  try {
    const data = await api.get('student', { params: { classroomId: id } });
    return data.map(student => {
      student.averageGrade = student.grades.length
        ? student.grades.reduce((prev, curr) => prev + (curr.value ?? 0), 0) /
          student.grades.length
        : 0;
      return student;
    });
  } catch (error) {
    return [];
  }
};

const getJoinRequests = async ({ id, isOwner }) => {
  if (!isOwner) return [];
  try {
    const data = await api.get(`classroom/${id}/requests`);
    return data;
  } catch (error) {
    return [];
  }
};

const getAssignments = async id => {
  try {
    const data = await api.get(`assignment`, { params: { classroomId: id } });
    return data;
  } catch (error) {
    return [];
  }
};

const getExams = async id => {
  try {
    const data = await api.get(`exam`, { params: { classroomId: id } });
    return data;
  } catch (error) {
    return [];
  }
};

const getMaterials = async id => {
  try {
    const data = await api.get(`material`, { params: { classroomId: id } });
    return data;
  } catch (error) {
    return [];
  }
};

function ClassroomNavbarLayout(props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [classroom, { mutate: setClassroom, refetch: refetchClassroom }] =
    createResource(id, getClassroom, { initialValue: {} });
  const isOwner = createMemo(
    () =>
      classroom.state == 'ready' && classroom().owner?.email == user().email,
  );
  const [students, { mutate: setStudents, refetch: refetchStudents }] =
    createResource(() => ({ id, isOwner: isOwner() }), getStudents, {
      initialValue: [],
    });
  const [
    joinRequests,
    { mutate: setJoinRequests, refetch: refetchJoinRequests },
  ] = createResource(() => ({ id, isOwner: isOwner() }), getJoinRequests, {
    initialValue: [],
  });
  const [lessons, { mutate: setLessons, refetch: refetchLessons }] =
    createResource(id, getLessons, { initialValue: [] });
  const [assignments, { mutate: setAssignments, refetch: refetchAssignments }] =
    createResource(id, getAssignments, {
      initialValue: [],
    });
  const [exams, { mutate: setExams, refetch: refetchExams }] = createResource(
    id,
    getExams,
    { initialValue: [] },
  );
  const [materials, { mutate: setMaterials, refetch: refetchMaterials }] =
    createResource(id, getMaterials, { initialValue: [] });

  const handleBack = () => {
    if (location.pathname === `/classroom/${id}`) {
      navigate('/classroom', { replace: true });
    } else {
      navigate(`/classroom/${id}`, { replace: true });
    }
  };

  return (
    <ClassroomContext.Provider
      value={{
        classroom,
        students,
        joinRequests,
        lessons,
        assignments,
        exams,
        materials,
        refetchClassroom,
        refetchStudents,
        refetchJoinRequests,
        refetchLessons,
        refetchAssignments,
        refetchExams,
        refetchMaterials,
        setClassroom,
        setStudents,
        setJoinRequests,
        setLessons,
        setAssignments,
        setExams,
        setMaterials,
        isOwner,
      }}>
      <div class="flex flex-col min-h-screen">
        <div class="p-6 flex flex-wrap justify-between items-center relative">
          <button
            class="text-blue-600 hover:underline flex items-center"
            onClick={handleBack}>
            <FiArrowLeft class="w-6 h-6 mr-2" />
            Quay lại
          </button>
          <h1 class="text-2xl font-bold text-center">
            {classroom.state == 'ready' && classroom().name}
          </h1>
          <A
            href="meeting"
            target="_blank"
            class="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out">
            {isOwner() ? 'Mở lớp' : 'Vào học'}
          </A>
        </div>
        <ErrorBoundary
          fallback={
            <div class="flex flex-grow justify-center items-center">
              <NoDataView />
            </div>
          }>
          <Switch>
            <Match when={classroom.loading}>
              <div class="flex-grow animate-skeleton" />
            </Match>
            <Match when={classroom()}>{props.children}</Match>
          </Switch>
        </ErrorBoundary>
      </div>
    </ClassroomContext.Provider>
  );
}

export const useClassroom = () => useContext(ClassroomContext);

export default ClassroomNavbarLayout;
