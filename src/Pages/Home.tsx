import React from 'react'
import Layout from '../Components/Layout/Layout';
import VideoCanvas from '../Components/VideoCanvas/VideoCanvas';

const Home: React.FC = () => {
    return (
        <Layout title="Video Player">
            <VideoCanvas />
            {/* <VideoPlaylist {...videoJsOptions}/> */}
        </Layout>
    )
}

export default Home;
