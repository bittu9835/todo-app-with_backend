import { useContext, useEffect, type FC } from 'react';
import PageHeader from '../../Common/PageHeader/PageHeader';
import Form from '../../Common/Inputs/Inputs';
import { GoHome } from 'react-icons/go';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { MyContext } from '../../../Contaxt/Contaxt';
import CompletedData from '../../Common/CompletedData/CompletedData';
import { BsCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { BiSolidTrash } from 'react-icons/bi';
import http from '../../../Services/http';

interface TasksProps { }

const Tasks: FC<TasksProps> = () => {
    const { LeftNaveBar, rander, darkMode, setRender, handleThemesToggle, task, setOpenEdit, setEditData, setTask }: any = useContext(MyContext)
    const themecolor = localStorage.getItem('Tasks-color') ?? '#333333';

    const fetchData = async () => {
        try {
            const response: any = await http({
                url: `/notes/task`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setTask(response?.data?.data)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error('Enternal Server Error');
            }
        }
    }

    const handleCheck = async (todo: any) => {
        try {
            const response: any = await http({
                url: `/notes/${todo._id}/completed`,
                method: 'delete',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                fetchData()
                setRender(!rander)
                toast.success(response.data.message)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error('Enternal Server Error');
            }
        }
    }

    const handleDelete = async (todo: any) => {
        try {
            const response: any = await http({
                url: `/notes/${todo._id}/delete`,
                method: 'delete',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                fetchData()
                setRender(!rander)
                toast.success(response.data.message)
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error('Enternal Server Error');
            }
        }
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rander])

    const handleEdit = (todo: any) => {
        setOpenEdit(true)
        setEditData(todo)
        setRender(!rander)
    }

    return (
        <div className=' w-full h-[92vh]'>
            <div className='w-full min-h-[24vh] h-auto  flex flex-col items-center'>
                <PageHeader heading={'Tasks'} icon={LeftNaveBar ? <  GoHome /> : <IoReorderThreeOutline className='text-2xl bg-gray-100' />} />
                <Form title='Task' />
            </div>
            <div onClick={handleThemesToggle} className='w-full h-[59vh] flex flex-col items-center overflow-y-auto scrollbar-hide mt-2 transition-all duration-300'>
                {task?.map((todo: any) => (
                    <div key={todo._id} className='w-[95%]  flex flex-col items-center mt-2 '>
                        <div className={`w-full min-h-[56px] h-auto py-2 rounded-md ${darkMode ? 'bg-[#141516] text-white hover:bg-[#2e2e30]' : 'bg-white hover:bg-gray-100 active:bg-[#eff6fc]'} flex items-center justify-between px-[20px] shadow-md`}>
                            <span style={{ color: themecolor }} className='cursor-pointer' onClick={() => handleCheck(todo)}><BsCircle />
                            </span>
                            <div onClick={() => handleEdit(todo)} className='w-[80%] px-1 '>
                                <p className=''>{todo?.tasks}</p>
                                <p className='text-xs'></p>
                            </div>
                            <span className='flex justify-end w-[10%] text-xl  text-blue-600 '>
                                <span className='cursor-pointer hover:text-red-400 text-blue-600' onClick={() => handleDelete(todo)}>
                                    <BiSolidTrash />
                                </span>
                            </span>
                        </div>
                    </div>))}
                <CompletedData />
            </div>
        </div>
    );
}

export default Tasks;
