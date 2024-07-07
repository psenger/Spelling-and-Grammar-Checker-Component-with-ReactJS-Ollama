import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaSpellCheck } from 'react-icons/fa'
import Input from '../component/Input'
import { sendOllamaGenerateRequest } from '../services/GrammarAndSpellingCheck'

type FormValues = {
    content: string
}

export default function Project() {
    const [disabled, setDisabled] = useState(false)
    const [updatedContent, setUpdatedContent] = useState('')
    const { handleSubmit, control, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            content: '',
        },
        mode: 'onChange',
    })
    const content = watch('content')
    const onSubmit = (data: FormValues) => {
        alert(data.content)
    }
    const onCheck = async () => {
        setDisabled(true)
        try {
            const results = await sendOllamaGenerateRequest({ content })
            setValue('content', results.response)
            setUpdatedContent(results.response)  // Update state with new content
        } catch (e) {
            // pop-toast
            console.log(e)
        } finally {
            setDisabled(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='stack__vertical' style={{ padding: '1rem' }}>
                <Input name='content' control={control} rules={{ required: true }} disabled={disabled} updatedContent={updatedContent} />
                <div className='stack__horizontal'>
                    <button className='btn btn--primary' onClick={onCheck} type='button'><FaSpellCheck/> Check Spelling</button>
                    <input className='btn btn--secondary' type='submit'/>
                </div>
            </div>
        </form>
    )
}
