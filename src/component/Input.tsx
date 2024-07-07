import { useEffect, useRef } from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import ControlledEditableDiv from '../component/ControlledEditableDiv'
import { FaDiaspora, FaCompress, FaExclamation, FaRegCheckCircle } from 'react-icons/fa'

type FormValues = {
    content: string
}

function Input(props: UseControllerProps<FormValues> & { updatedContent: string }) {
    const { field, fieldState } = useController(props)
    const editableDivRef = useRef<{ replaceContentWithSpans: (content: string) => void }>(null)

    useEffect(() => {
        if (editableDivRef.current && props.updatedContent) {
            editableDivRef.current.replaceContentWithSpans(props.updatedContent)
        }
    }, [props.updatedContent])

    return (
        <div className='stack__vertical'>
            <ControlledEditableDiv {...field}
                                   ref={editableDivRef}
                                   placeholder='Enter some text...'
                                   className='editable-div'/>
            {fieldState.isTouched && (<span><FaDiaspora/> Touched</span>)}
            {fieldState.isDirty && (<span><FaCompress/> Dirty</span>)}
            {fieldState.invalid
                ? (<span><FaExclamation className='form-validation__error'/> Invalid</span>)
                : (<span><FaRegCheckCircle className='form-validation__success'/> Valid</span>)}
        </div>
    )
}

export default Input
