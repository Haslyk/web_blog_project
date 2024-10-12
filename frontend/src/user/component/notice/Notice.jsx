import './notice.css'

const Notice = ({ notice, onClick }) => {
  return (
    <div className='notice' onClick={onClick}>
        <div className="notice-holder">
          <p>{notice}</p>
          <p className='know-more'>İncele</p>
        </div>
    </div>
  )
}

export default Notice