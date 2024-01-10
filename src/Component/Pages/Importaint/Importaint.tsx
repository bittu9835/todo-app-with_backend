import { useContext, type FC, useEffect } from 'react';
import { AiOutlineStar } from 'react-icons/ai'
import PageHeader from '../../Common/PageHeader/PageHeader';
import Form from '../../Common/Inputs/Inputs';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { MyContext } from '../../../Contaxt/Contaxt';
import { BsCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { BiSolidTrash } from 'react-icons/bi';
import { motion } from 'framer-motion';
import http from '../../../Services/http';

interface ImportaintProps { }

const Importaint: FC<ImportaintProps> = () => {
    const { LeftNaveBar, setRender, rander, setOpenEdit, setEditData, darkMode, handleThemesToggle, Importaint, setImportaint }: any = useContext(MyContext)

    const fetchData = async () => {
        try {
            const response: any = await http({
                url: `/notes/Importent`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setImportaint(response?.data?.data)
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

    const themecolor = localStorage.getItem('Importaint-color') ?? '#333333';

    return (
            <div className=' w-full h-[92vh]'>
                <div className='w-full min-h-[24vh] h-auto  flex flex-col items-center'>
                    <PageHeader heading={'Importaint'} icon={LeftNaveBar ? < AiOutlineStar /> : <IoReorderThreeOutline className='text-2xl bg-gray-100' />} />
                    <div className='w-full h-full'>
                        <Form title='Importent' />
                    </div>
                    <div onClick={handleThemesToggle} className='w-full h-[59vh] flex flex-col items-center overflow-y-auto scrollbar-hide mt-2'>
                        {Importaint?.map((todo: any) => (
                            <motion.div
                                initial={{ y: -30 }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeOut'
                                }} key={todo._id} className='w-[95%]  flex flex-col items-center mt-2 '>
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
                            </motion.div>))}
                    </div>
                </div>
            </div>
    );
}
export default Importaint;
