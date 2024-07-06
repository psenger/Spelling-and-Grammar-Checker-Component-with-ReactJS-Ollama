import React, { useEffect, useRef, SyntheticEvent, type HTMLAttributes} from 'react'

/**
 * Represents the props for the EditableDiv component.
 * @interface EditableDivProps
 * @extends HTMLAttributes<HTMLDivElement>
 */
interface EditableDivProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    onContentChange?: (newValue: string) => void
    placeholder?: string
}

/**
 * EditableDiv component
 * @component
 * @example
 * <EditableDiv
 *   value={content}
 *   onContentChange={handleContentChange}
 *   defaultValue="Default Value"
 *   placeholder="Enter text here..."
 *   className="editable-div"
 *   id="editable-div-1"
 * />
 * @param {Object} props - The component props
 * @param {string} props.value - The current value of the editable div
 * @param {function} props.onContentChange - The callback function triggered when the content of the div changes
 * @param {string} [props.defaultValue] - The default value to display in the div if no value is provided
 * @param {string} [props.placeholder] - The placeholder text to display when the div is empty
 * @param {Object} [props.rest] - Additional props to be passed to the underlying div element
 * @returns {JSX.Element} - The rendered EditableDiv component
 */
export const EditableDiv: React.FC<EditableDivProps> = (props) => {
    const { value, onContentChange, defaultValue, placeholder, ...rest } = props
    const editorRefDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const contentValue = value ?? defaultValue ?? ''
        if (editorRefDiv.current && editorRefDiv.current.textContent !== contentValue) {
            editorRefDiv.current.textContent = contentValue
        }
        if (editorRefDiv.current) {
            if (!contentValue && placeholder) {
                editorRefDiv.current.setAttribute('data-placeholder', placeholder)
                editorRefDiv.current.classList.add('editable-div__placeholder')
            } else {
                editorRefDiv.current.removeAttribute('data-placeholder')
                editorRefDiv.current.classList.remove('editable-div__placeholder')
            }
        }
    }, [value, defaultValue, placeholder])

    const handleInput = (e: SyntheticEvent) => {
        const target = e.target as HTMLDivElement
        if (onContentChange) {
            onContentChange(target.textContent || '')
        }
    }

    return (
        <div
            ref={editorRefDiv}
            contentEditable={true}
            onInput={handleInput}
            {...rest}
            style={{ position: 'relative', minHeight: '1.2em' }}
        />
    )
}

/**
 * Represents the props for a controlled editable div component.
 */
export interface ControlledEditableDivProps extends Omit<EditableDivProps, 'onContentChange'> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * A controlled editable div component.
 *
 * @param {Object} props - The component properties.
 * @param {function} props.onChange - The callback function to be called when the content value changes.
 * @param {string} props.value - The value of the editable div.
 * @param {string} props.placeholder - The placeholder text to be shown when the editable div is empty.
 * @param {Object} props.rest - The remaining properties to be passed to the underlying EditableDiv component.
 *
 * @returns {React.Component} A React component representing the controlled editable div.
 */
const ControlledEditableDiv: React.FC<ControlledEditableDivProps> = ({ onChange, value, placeholder, ...rest }) => {
    const handleContentChange = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: newValue,
                },
            } as React.ChangeEvent<HTMLInputElement>
            onChange(syntheticEvent)
        }
    }

    const handleInput = (e: SyntheticEvent) => {
        const target = e.target as HTMLDivElement
        handleContentChange(target.textContent || '')
    }

    return (
        <EditableDiv
            value={value}
            onContentChange={handleContentChange}
            onInput={handleInput}
            placeholder={placeholder}
            {...rest}
        />
    )
}

export default ControlledEditableDiv
