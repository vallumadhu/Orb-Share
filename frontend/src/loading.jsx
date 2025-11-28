export default function Loading(props) {
    return (<>
        <div className="loading" style={{ display: props.showLoading ? "block" : "none" }}></div>
    </>)
}