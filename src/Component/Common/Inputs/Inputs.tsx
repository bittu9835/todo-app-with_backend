import { type FC, useContext } from 'react';
import { BsCircle } from 'react-icons/bs'
import { AiOutlineSend } from 'react-icons/ai'
import { MyContext } from '../../../Contaxt/Contaxt';
import { Field, Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import http from '../../../Services/http';

interface FormProps {
    title?: string
}
interface IFormValue {
    page?: string;
    tasks: string,
};

const Inputs: FC<FormProps> = ({ title }) => {
    const { setRender, rander, darkMode, editForm }: any = useContext(MyContext);

    const initialValues: IFormValue = {
        tasks: '',
    };

    const validationSchema = Yup.object().shape({
        tasks: Yup.string().required('task is required')
    });

    const handleSubmit = async (values: IFormValue, { resetForm }: FormikHelpers<IFormValue>) => {
        values['page'] = title ? title : '';
        try {
            const response: any = await http({
                url: `/notes/create`,
                method: 'post',
                data: values
            });
            if (response?.data?.code === 'SUCCESS_200') {
                setRender(!rander)
                toast.success(response.data.message)
            } else {
                toast.error(response?.data?.message);
                console.log('not post')
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error?.response?.data?.message);
            } else {
                toast.error('Enternal Server Error');
            }
        }
        resetForm();
    };

    return (
        <div className={`w-full ${editForm ? '' : 'mb-4'} flex  flex-col items-center  gap-5`}>
            <div className='w-[95%] rounded-xl  shadow-md bg-[#fff]  relative'>
                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                >
                    <Form className='w-full h-full rounded-xl'>
                        <div className='w-full h-14'>
                            <Field
                                name='tasks'
                                id='tasks'
                                type='text' placeholder='Add a task' className={`w-full h-full rounded-md focus:outline-none px-14 placeholder:text-sm placeholder:text-[#222222] ${darkMode && 'bg-[#252423] text-white placeholder:text-white'} text-sm text-[#333333]`} />
                        </div>
                        <button type='submit' className='absolute top-[19px] right-[20px] cursor-pointer'><AiOutlineSend className='text-xl text-green-600 cursor-pointer' /></button>
                        <span className='absolute top-[19px] left-[25px] cursor-pointer'><BsCircle /></span>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

export default Inputs;

