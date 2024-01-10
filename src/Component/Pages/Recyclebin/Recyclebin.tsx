import { useContext, type FC, useEffect, useState } from 'react';
import PageHeader from '../../Common/PageHeader/PageHeader';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MyContext } from '../../../Contaxt/Contaxt';
import { IoReorderThreeOutline } from 'react-icons/io5';
import { TbClockDown } from 'react-icons/tb';
import { MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import http from '../../../Services/http';


interface RecycleBinProps { }

const RecycleBin: FC<RecycleBinProps> = () => {
    const { LeftNaveBar, rander, setRender, darkMode, handleThemesToggle }: any = useContext(MyContext)
    const [recycleBin, setRecycleBin] = useState([])
    const [conformPopup, setConformPopup] = useState(false)

    const fetchData = async () => {
        try {
            const response: any = await http({
                url: `/notes/Recyclebin`,
                method: 'get',
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setRecycleBin(response?.data?.data)
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
                url: `/notes/${todo._id}/parmanentdelete`,
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

    const handleRestore = async (todo: any) => {
        try {
            const response: any = await http({
                url: `/notes/${todo._id}/restore`,
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

    const handleDeleteAll = async () => {
        setConformPopup(false)
        try {
            const response: any = await http({
                url: `/notes/parmanentdeleteall`,
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

    const handleClear = () => {
        if (recycleBin.length > 0) {
            setConformPopup(true)
        }
    }



    return (
        <div className=' w-full h-[92vh] relative'>
            {conformPopup ?
                <div className='absolute bg-black bg-opacity-60  top-0 bottom-0 left-0 right-0 z-40 flex flex-col justify-center items-center'>
                    <div className={`w-auto h-32  ${darkMode ? 'bg-[#22201e] text-white' : 'bg-white'} rounded-lg px-5 pt-5 pb-2 flex flex-col justify-between relative`}>
                        <p className='font-medium'>Are you sure want to delete all permanently</p>
                        <div className='flex justify-between font-bold'>
                            <div onClick={() => setConformPopup(false)} className='cursor-pointer'>Cancle</div>
                            <div onClick={handleDeleteAll} className='cursor-pointer text-red-600'>Delete</div>
                        </div>
                    </div>
                </div>
                : ''}
            <div className='w-full min-h-[15vh] h-auto  flex flex-col items-center'>
                <PageHeader heading={'Trash'} handleClear={handleClear} clear={'Clear All'} icon={LeftNaveBar ? <  RiDeleteBin6Line /> : <IoReorderThreeOutline className='text-2xl bg-gray-100' />} />
                <motion.div
                    initial={{ y: -30 }}
                    animate={{ y: 0 }}
                    transition={{
                        duration: 1,
                        ease: 'easeOut'
                    }}
                    onClick={handleThemesToggle} className='w-full h-[74vh] flex flex-col items-center overflow-y-auto scrollbar-hide mt-2'>
                    {recycleBin?.map((todo: any) => (
                        <motion.div
                            initial={{ y: -30 }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: 'easeOut'
                            }} key={todo._id} className='w-[95%]  flex flex-col items-center mt-2 transition-all duration-300'>
                            <div className={`w-full min-h-[56px] h-auto py-2 rounded-md ${darkMode ? 'bg-[#030608] text-white hover:bg-gray-800' : 'bg-white hover:bg-gray-100 active:bg-[#eff6fc]'} flex items-center justify-between px-[20px] shadow-md`}>
                                <span className='cursor-pointer' onClick={() => handleRestore(todo)}><TbClockDown className='text-green-500 text-xl' />
                                </span>
                                <div className='w-[80%] px-1 '>
                                    <p className={`${todo.isCompleted === true && 'line-through'}`}>{todo?.tasks}</p>
                                    <p className='text-xs'></p>
                                </div>
                                <span className='flex justify-end w-[10%] text-xl  text-blue-600 '>
                                    <span className='cursor-pointer text-red-500' onClick={() => handleDelete(todo)}>
                                        <MdDeleteForever />
                                    </span>
                                </span>
                            </div>
                        </motion.div>))}
                </motion.div>
            </div>
        </div>
    );
}

export default RecycleBin;

