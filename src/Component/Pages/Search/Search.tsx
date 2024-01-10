import { useContext, type FC, useEffect, useState } from 'react';
import { MyContext } from '../../../Contaxt/Contaxt';
import { BiSolidTrash } from 'react-icons/bi';
import { BsCheckCircle, BsCircle } from 'react-icons/bs';
import { LiaAngleDownSolid, LiaAngleRightSolid } from 'react-icons/lia';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import search from '../../../Assets/empty_search-removebg-preview.png'
import { motion } from 'framer-motion';
import { IoReorderThreeOutline } from 'react-icons/io5'
import http from '../../../Services/http';
interface SearchProps { }

const Search: FC<SearchProps> = () => {
    const { rander, darkMode, setRender, searchValue, LeftNaveBar, setLeftNaveBar, setOpenEdit, setEditData }: any = useContext(MyContext);
    const [toggleComplet, setToggleComplet] = useState(true);
    const [searchData, setSearchData] = useState([])
    const navigate = useNavigate()


    const fetchData = async () => {
        if (searchValue) {
            try {
                const response: any = await http({
                    url: `/notes/search/${searchValue}`,
                    method: 'get',
                });
                if (response?.data?.code === 'SUCCESS_200') {
                    setSearchData(response?.data?.data)
                    navigate(`/Searching/:${searchValue}`)
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
    }

    const handleCheckOut = async (todo: any) => {
        if (todo.isCompleted === true) {
            try {
                const response: any = await http({
                    url: `/notes/${todo._id}/CkeckoutNotes`,
                    method: 'get',
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
        } else {
            try {
                const response: any = await http({
                    url: `/notes/${todo._id}/completed`,
                    method: 'get',
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
    }

    const handleDelete = async (todo: any) => {
        try {
            const response: any = await http({
                url: `/notes/${todo._id}/delete`,
                method: 'get',
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
    }, [rander, searchValue])

    const handleEdit = (todo: any) => {
        setOpenEdit(true)
        setEditData(todo)
        setRender(!rander)
    }
    return (
        <div className=' w-full h-[92vh]'>
            <div className='w-full min-h-[15vh] h-auto  flex flex-col items-center'>
                <div className='w-[95%] h-auto text-xl flex font-bold text-blue-700 py-8 px-5'>
                    {LeftNaveBar ? '' :
                        <span onClick={() => setLeftNaveBar(true)}><IoReorderThreeOutline className='text-2xl bg-gray-100 mr-2' />
                        </span>}
                    <span className=''>Searching for</span>
                    <span>"{searchValue}"</span>
                </div>
            </div>
            <div className='w-full h-[74vh] flex flex-col items-center overflow-y-auto scrollbar-hide mt-2'>
                {searchValue ?
                    <>
                        {searchData?.length > 0 ?
                            <>
                                <div className='w-[95%] flex items-center gap-4 mt-6 transition-all duration-300 cursor-pointer' onClick={() => setToggleComplet(!toggleComplet)}>
                                    <span>{toggleComplet ? <LiaAngleDownSolid /> : <LiaAngleRightSolid />}</span>
                                    <p className='text-md font-semibold'>Tasks</p>
                                    <span>{searchData?.length}</span>
                                </div>
                                {toggleComplet ?
                                    <motion.div
                                        initial={{ y: -30 }}
                                        animate={{ y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: 'easeOut'
                                        }}
                                        className='w-[95%] h-full flex flex-col'>
                                        {searchData?.map((todo: any) => (
                                            <div key={todo._id} className='w-[95%]  flex flex-col items-center mt-2 transition-all duration-300'>
                                                <div className={`w-full min-h-[56px] h-auto py-2 rounded-md ${darkMode ? 'bg-[#141516] text-white hover:bg-[#2e2e30]' : 'bg-white hover:bg-gray-100 active:bg-[#eff6fc]'} flex items-center justify-between px-[20px] shadow-md`}>
                                                    <span className='cursor-pointer text-blue-500' onClick={() => handleCheckOut(todo)}>
                                                        {todo.isCompleted === true ? < BsCheckCircle /> : <BsCircle />}
                                                    </span>
                                                    <div onClick={() => handleEdit(todo)} className='w-[80%] px-1 '>
                                                        <p className={`${todo.isCompleted === true && 'line-through'}`}>{todo?.tasks}</p>
                                                        <p className='text-xs text-[#d25359]'>{todo?.page}</p>
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
                        }  </> : <img src={search} alt="" />}
            </div>
        </div>
    );
}

export default Search;
