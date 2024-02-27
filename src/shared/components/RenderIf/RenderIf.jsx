const RenderIf = ({ children, condition, renderElse = "" }) => {
    if (condition) return <>{children}</>
    return renderElse;
}
export default RenderIf;
