export default function ErrorMessage({ message }: any) {
    if (message != null)
        return <span className='mx-3 text-danger'>{message}</span>
    return null;
}