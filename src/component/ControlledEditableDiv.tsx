import React, { forwardRef } from 'react'
import EditableDiv, { EditableDivProps, EditableDivHandle } from './EditableDiv'

const sanitizeInput = (input: string): string => {
    const div = document.createElement('div')
    div.innerText = input
    return div.innerText
}

export interface ControlledEditableDivProps extends Omit<EditableDivProps, 'onContentChange'> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const ControlledEditableDiv = forwardRef<EditableDivHandle, ControlledEditableDivProps>(({ onChange, value, placeholder, ...rest }, ref) => {
    const handleContentChange = (newValue: string) => {
        const sanitizedValue = sanitizeInput(newValue)
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: sanitizedValue,
                },
            } as React.ChangeEvent<HTMLInputElement>
            onChange(syntheticEvent)
        }
    }

    return (
        <EditableDiv
            ref={ref}
            value={value}
            onContentChange={handleContentChange}
            placeholder={placeholder}
            {...rest}
        />
    )
})

export default ControlledEditableDiv
