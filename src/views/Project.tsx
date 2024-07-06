import {FaSpellCheck, FaRegCheckCircle, FaExclamation, FaCompress, FaDiaspora} from 'react-icons/fa'
import {useForm, useController, UseControllerProps} from 'react-hook-form'
import ControlledEditableDiv from '../component/ControlledEditableDiv.tsx'
import {sendOllamaGenerateRequest} from '../services/GrammarAndSpellingCheck.tsx'

type FormValues = {
    content: string
}

function Input(props: UseControllerProps<FormValues>) {
    const {field, fieldState} = useController(props)
    return (
        <div className='stack__vertical'>
            <ControlledEditableDiv {...field} placeholder='Enter some text...' className='editable-div'/>
            {fieldState.isTouched && (<span><FaDiaspora/> Touched</span>)}
            {fieldState.isDirty && (<span><FaCompress/> Dirty</span>)}
            {fieldState.invalid
                ? (<span><FaExclamation className='form-validation__error'/> Invalid</span>)
                : (<span><FaRegCheckCircle className='form-validation__success'/> Valid</span>)}
        </div>
    )
}

export default function Project() {
    const {handleSubmit, control, watch, setValue} = useForm<FormValues>({
        defaultValues: {
            content: '',
        },
        mode: 'onChange',
    })
    const content = watch('content')
    const onSubmit = (data: FormValues) => {

        console.log('content submitted to the server',data)
    }
    const onCheck = () => {
        sendOllamaGenerateRequest({content})
            .then((response) => {
                setValue('content', response.response)
            })
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='stack__vertical'>
                <Input name='content' control={control} rules={{required: true}}/>
                <div className='stack__horizontal'>
                    <button className='btn btn--primary' onClick={onCheck} type='button'><FaSpellCheck/> Check Spelling</button>
                    <input className='btn btn--secondary' type='submit'/>
                </div>
            </div>
        </form>
    )
}
