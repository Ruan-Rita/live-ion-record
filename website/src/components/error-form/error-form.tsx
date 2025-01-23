type ErrorFormType = {
    nameField: string,
    errors: any
}
export default function ErrorForm({nameField, errors}: ErrorFormType) {
    console.log({nameField, errors});
    
    return (
        <>
            {errors && errors[nameField] && <span className="text-xs text-red-500">{errors[nameField].message || 'This field is required'}</span>}
        </>
    )
}