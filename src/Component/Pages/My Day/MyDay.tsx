import { useContext, type FC, useEffect, useState } from 'react';
import PageHeader from '../../Common/PageHeader/PageHeader';
import Inputs from '../../Common/Inputs/Inputs';
import { BiSun } from 'react-icons/bi';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { MyContext } from '../../../Contaxt/Contaxt';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { LiaAngleDownSolid, LiaAngleRightSolid } from 'react-icons/lia';
import { BiSolidTrash } from 'react-icons/bi';
import { motion } from 'framer-motion';
import http from '../../../Services/http';


interface MyDayProps { }

const MyDay: FC<MyDayProps> = () => {
    const { setEditData, setOpenEdit, LeftNaveBar, setRender, rander, handleThemesToggle, darkMode, MyDay, setMyDay }: any = useContext(MyContext)
    const [toggleComplet, setToggleComplet] = useState(false);
    const [myDayComplete, setMyDayComplete] = useState([])


    const fetchData = async () => {
        try {
            const response: any = await http({
                url: `/notes/MyDay`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setMyDay(response?.data?.data)
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
        //For completeData
        try {
            const response: any = await http({
                url: `/notes/mydayconplete`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setMyDayComplete(response?.data?.data)
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

    const handleCheckOut = async (todo: any) => {
        try {
            const response: any = await http({
                url: `/notes/${todo._id}/CkeckoutNotes`,
                method: 'delete',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                fetchData()
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

    const handleEdit = (todo: any) => {
        setOpenEdit(true)
        setEditData(todo)
        setRender(!rander)
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rander])

    const themecolor = localStorage.getItem('My Day-color') ?? '#482ff7';
    return (
            <div className=' w-full h-[92vh] scrollbar-hide'>
                <div className='w-full min-h-[24vh] h-auto  flex flex-col items-center'>
                    <PageHeader heading={'My Day'} icon={LeftNaveBar ? <  BiSun /> : <IoReorderThreeOutline className='text-2xl bg-gray-100' />} />
                    <div className='w-full h-full'>
                        <Inputs title='My Day' />
                    </div>
                    <div id='My Day' onClick={handleThemesToggle} className='w-full h-[59vh] flex flex-col items-center scrollbar-hide overflow-y-auto mt-2'>
                        {[...MyDay]?.reverse()?.map((todo: any, index: number) => (
                            <motion.div
                                initial={{ y: -30 }}
                                animate={{ y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: 'easeOut'
                                }}
                                key={index} className='w-[95%]  flex flex-col items-center mt-2'>
                                <div className={`w-full scrollbar-hide min-h-[56px] h-auto py-2 rounded-md ${darkMode ? 'bg-[#141516] text-white hover:bg-[#2e2e30]' : 'bg-white hover:bg-gray-100 active:bg-[#eff6fc]'} flex items-center justify-between px-[20px] shadow-md`}>
                                    <span style={{ color: themecolor }} className='cursor-pointer' onClick={() => handleCheck(todo)}><BsCircle />
                                    </span>
                                    <div onClick={() => handleEdit(todo)} className='w-[80%] px-1 '>
                                        <p className=''>{todo?.tasks}</p>
                                        <p className='text-xs'></p>
                                    </div>
                                    <span className='flex justify-end w-[10%] text-xl'>
                                        <span className='cursor-pointer hover:text-red-400 text-blue-600' onClick={() => handleDelete(todo)}>
                                            <BiSolidTrash />
                                        </span>
                                    </span>
                                </div>
                            </motion.div>))}
                        {myDayComplete?.length > 0 ?
                            <>
                                <div className='w-[95%] flex items-center gap-4 mt-6' onClick={() => setToggleComplet(!toggleComplet)}>
                                    <span>{toggleComplet ? <LiaAngleDownSolid /> : <LiaAngleRightSolid />}</span>
                                    <p className='text-md font-semibold'>completed</p>
                                    <span>{myDayComplete?.length}</span>
                                </div>
                                {toggleComplet ?
                                    <motion.div
                                        initial={{ y: -30 }}
                                        animate={{ y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: 'easeOut'
                                        }} className='w-[95%] h-full flex flex-col'>
                                        {myDayComplete?.map((todo: any) => (
                                            <div key={todo._id} className='w-[95%]  flex flex-col items-center mt-2 '>
                                                <div className={`w-full min-h-[56px] h-auto py-2 rounded-md ${darkMode ? 'bg-[#141516] text-white hover:bg-[#525355]' : 'bg-white hover:bg-gray-100 active:bg-[#eff6fc]'} flex items-center justify-between px-[20px] shadow-md`}>
                                                    <span style={{ color: themecolor }} className='cursor-pointer' onClick={() => handleCheckOut(todo)}>< BsCheckCircle />
                                                    </span>
                                                    <div onClick={() => handleEdit(todo)} className='w-[80%] px-1 '>
                                                        <p className='w-[80%] px-1 line-through'>{todo?.tasks}</p>
                                                        <p className='text-xs'></p>
                                                    </div>
                                                    <span className='flex justify-end w-[10%] text-xl  text-blue-600 '>
                                                        <span className='cursor-pointer hover:text-red-400 text-blue-600' onClick={() => handleDelete(todo)}>
                                                            <BiSolidTrash />
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>))}
                                    </motion.div>
                                    : <hr className='mt-5 w-full' />
                                }
                            </>
                            : <></>
                        }
                    </div>
                </div>
            </div>
    );
}

export default MyDay;
