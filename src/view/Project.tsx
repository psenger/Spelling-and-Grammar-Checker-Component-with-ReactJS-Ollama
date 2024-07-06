
import {useForm, useController, UseControllerProps} from 'react-hook-form'
import ControlledEditableDiv from '../componet/ControlledEditableDiv.tsx'

type FormValues = {
    content: string
}

function Input(props: UseControllerProps<FormValues>) {
    const {field, fieldState} = useController(props)
    return (
        <div>
            <ControlledEditableDiv {...field} placeholder="Enter some text..." className='editable-div'/>
            <p>{fieldState.isTouched && 'Touched'}</p>
            <p>{fieldState.isDirty && 'Dirty'}</p>
            <p>{fieldState.invalid ? 'invalid' : 'valid'}</p>
        </div>
    )
}

export default function Project() {
    const {handleSubmit, control} = useForm<FormValues>({
        defaultValues: {
            content: '',
        },
        mode: 'onChange',
    })
    const onSubmit = (data: FormValues) => console.log(data)

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input name="content" control={control} rules={{ required: true }}  />
            <input type="submit"/>
        </form>
    )
}
