import React, {useEffect, useRef, SyntheticEvent, type HTMLAttributes} from 'react'

/**
 * Represents the properties for the EditableDiv component.
 */
interface EditableDivProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    onContentChange?: (newValue: string) => void
    placeholder?: string
    disabled?: boolean
}

/**
 * Sanitizes an input string by removing any HTML tags.
 *
 * @param {string} input - The string to be sanitized.
 * @returns {string} - The sanitized string with no HTML tags.
 */
const sanitizeInput = (input: string): string => {
    const div = document.createElement('div')
    div.innerText = input
    return div.innerText
}

/**
 * Represents an editable div component in React.
 *
 * @component
 * @param {EditableDivProps} props - The properties of the EditableDiv component.
 * @returns {React.ReactElement} - The rendered EditableDiv component.
 */
export const EditableDiv: React.FC<EditableDivProps> = (props) => {
    const {value, onContentChange, defaultValue, placeholder, disabled, ...rest} = props
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
        const sanitizedContent = sanitizeInput(target.textContent || '')
        if (editorRefDiv.current && editorRefDiv.current.textContent !== sanitizedContent) {
            editorRefDiv.current.textContent = sanitizedContent
        }
        if (onContentChange) {
            onContentChange(sanitizedContent)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) {
            e.preventDefault()
        }
    }

    const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData?.getData('text/plain') || ''
        const sanitizedText = sanitizeInput(text)
        document.execCommand('insertText', false, sanitizedText)
    }

    useEffect(() => {
        const currentDiv = editorRefDiv.current
        if (currentDiv) {
            currentDiv.addEventListener('paste', handlePaste)
        }
        return () => {
            if (currentDiv) {
                currentDiv.removeEventListener('paste', handlePaste)
            }
        }
    }, [])

    return (
        <div
            ref={editorRefDiv}
            onFocus={(e) => {
                !disabled && handleInput(e);
                disabled && e.currentTarget.blur()
            }}
            contentEditable={!disabled}
            onKeyDown={handleKeyDown}
            {...rest}
            style={{
                position: 'relative',
                minHeight: '1.2em',
                backgroundColor: disabled ? '#f0f0f0' : 'white',
                pointerEvents: disabled ? 'none' : 'auto',
                userSelect: disabled ? 'none' : 'auto'
            }}
            aria-disabled={disabled}
        />
    )
}

/**
 * Represents the props for a controlled editable div component.
 * @interface ControlledEditableDivProps
 * @extends Omit<EditableDivProps, 'onContentChange'>
 */
export interface ControlledEditableDivProps extends Omit<EditableDivProps, 'onContentChange'> {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * A controlled editable div component.
 *
 * @component
 * @example
 * <ControlledEditableDiv
 *     onChange={handleChange}
 *     value={text}
 *     placeholder="Enter text"
 *     autoFocus
 * />
 *
 * @param {Object} props - The component props.
 * @param {function} props.onChange - The callback function triggered when the content changes.
 * @param {string} props.value - The current value of the editable div.
 * @param {string} props.placeholder - The placeholder text to be shown when the div is empty.
 * @returns {JSX.Element} The controlled editable div component.
 */
const ControlledEditableDiv: React.FC<ControlledEditableDivProps> = ({onChange, value, placeholder, ...rest}) => {
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
        handleContentChange(sanitizeInput(target.textContent || ''))
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
