import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL, list } from 'firebase/storage'
import { storage } from './firebase/firebase'
import InfiniteScroll from 'react-infinite-scroller';

const getType = ext => {
  if (ext == 'mp4') return 'video'
  else if (ext == 'pdf') return ext
  else return 'image'
}

function App() {
  const scrollRef = useRef()
  const [files, setFiles] = useState([])
  const [state, setState] = useState({ loading: false });
  const [token, setToken] = useState({})


  const handleFetch = async () => {
    if (state.loading) return
    setState({ ...state, loading: true })
    const listRef = ref(storage, 'images');
    let params = { maxResults: 5 }
    if (files.length) params.pageToken = token
    const page = await list(listRef, params);
    setToken(page.nextPageToken)
    Promise.allSettled(page.items.map(getDownloadURL))
      .then(data => {
        setState({ ...state, loading: false })
        setFiles(files => files.concat(data.map(i => ({ url: i.value, type: getType(new URL(i.value).pathname.split('.').pop()) }))))
      })
      .catch(console.error)
  }

  const handleInputChange = e => {
    const file = e.target.files[0]
    const fileRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file)
    setState({ uploading: true, progress: 0 })
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setState(state => ({ ...state, progress }))
    }, console.error, () => {
      getDownloadURL(fileRef)
        .then((url) => {
          setState({ uploading: false, progress: 0 })
          setFiles(items => [{ url, type: getType(new URL(url).pathname.split('.').pop()) }].concat(items));
        });
    });
  }

  const handleClick = (e, url) => {
    e.preventDefault()
    navigator.clipboard.writeText(url);
  }

  return (
    <div className="container">
      <InfiniteScroll
        pageStart={0}
        initialLoad={true}
        loadMore={handleFetch}
        hasMore={!!token && !state.loading}
        loader={<div className="loader" key={0}>Loading ...</div>}
        threshold={500}
      >
        <div className="row">
          <div className="col-12 p-3 border rounded border-dark my-3">
            <h2 className="text-center">BizzTM File Uploader</h2>
            <div className="text-center">
              <label role='button'>
                <img src='add-icon.ico' width='30' />
                <input type='file' className='d-none' onChange={handleInputChange} onClick={e => e.target.value = null} />
              </label>
            </div>
            <div className="progress my-3">
              <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" style={{ width: `${state.progress}%` }} aria-valuemax="100"></div>
            </div>
          </div>
          {files.map((file, i) => (
            <div key={i} className='col-3 mb-3'>
              <div className='border rounded h-100 d-flex' onContextMenu={e => handleClick(e, file.url)}>
                {file.type == 'image' ? (
                  <img src={file.url} className='img-fluid' />
                ) : (
                  <div className='text-uppercase m-auto'>{file.type}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default App;
