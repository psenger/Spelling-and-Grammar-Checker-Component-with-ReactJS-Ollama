import React, { useEffect, useRef, SyntheticEvent, type HTMLAttributes, useImperativeHandle, forwardRef } from 'react'

export interface EditableDivProps extends HTMLAttributes<HTMLDivElement> {
    value: string
    onContentChange?: (newValue: string) => void
    placeholder?: string
    disabled?: boolean
}

export interface EditableDivHandle {
    replaceContentWithSpans: (content: string) => void
}

const EditableDiv = forwardRef<EditableDivHandle, EditableDivProps>((props, ref) => {
    const { value, onContentChange, defaultValue, placeholder, disabled, ...rest } = props
    const editorRefDiv = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
        replaceContentWithSpans(content: string) {
            if (editorRefDiv.current) {
                editorRefDiv.current.innerHTML = content
            }
        }
    }), [])

    useEffect(() => {
        const contentValue = value ?? defaultValue ?? ''
        if (editorRefDiv.current && editorRefDiv.current.innerHTML !== contentValue) {
            editorRefDiv.current.innerHTML = contentValue
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
        const content = target.innerHTML || ''
        if (editorRefDiv.current && editorRefDiv.current.innerHTML !== content) {
            editorRefDiv.current.innerHTML = content
        }
        if (onContentChange) {
            onContentChange(content)
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
        document.execCommand('insertText', false, text)
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

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
        if (disabled) {
            e.currentTarget.blur()
        } else {
            handleInput(e)
        }
    }

    return (
        <div
            ref={editorRefDiv}
            onFocus={handleFocus}
            contentEditable={!disabled}
            spellCheck={true}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            {...rest}
            style={{
                backgroundColor: disabled ? '#f0f0f0' : 'white',
                pointerEvents: disabled ? 'none' : 'auto',
                userSelect: disabled ? 'none' : 'auto',
            }}
            aria-disabled={disabled}
        />
    )
})

export default EditableDiv
