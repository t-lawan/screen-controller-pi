import React from "react";
import styled from "styled-components";

const DivWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`;

const ControlWrapper = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 10vh;
  left: 0%;
  justify-content: space-around;
  :hover {
    cursor: pointer;
    font-style: italic;
  }
`;

const ControlText = styled.p`
  color: rgb(0, 255, 0);
`;
interface VideoCanvasProps {
  [propName: string]: any;
}

interface VideoCanvasState {
  width: number;
  height: number;
  index: number;
  isStreaming: boolean;
  streamUrl: string;
}
export default class VideoCanvas extends React.Component<
  VideoCanvasProps,
  VideoCanvasState
> {
  video: HTMLVideoElement | null = null;
  canvas: React.RefObject<HTMLCanvasElement>;
  canvasContext: CanvasRenderingContext2D | null = null;
  animation: number | null = null;
  alpha = 1;
  blur = 100;
  grayscale = 100;
  index = 0;

  playlist = [
    "https://marie-leuder.s3.eu-west-2.amazonaws.com/VIDEO_ONE.mp4",
    "https://marie-leuder.s3.eu-west-2.amazonaws.com/VIDEO_TWO.mp4",
    "https://marie-leuder.s3.eu-west-2.amazonaws.com/VIDEO_THREE.mp4"
  ];

  constructor(props: VideoCanvasProps) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      index: 0,
      isStreaming: false,
      streamUrl:
        "http://admin:false.memory@192.168.0.25/ISAPI/Streaming/channels/102/httpPreview"
    };
    this.canvas = React.createRef();
  }
  componentDidMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.createVideoElement();
    this.setVideoCanvasContext();
  }

  createVideoElement = () => {
    if (this.video) {
      this.video.remove();
    }
    this.video = document.createElement("video");
    this.video.setAttribute("width", "1");
    this.video.setAttribute("height", "1");
    this.video.setAttribute("display", "none");
    this.video.setAttribute("mute", "1");
    this.video.setAttribute("crossorigin", "anonymous");

    let source = document.createElement("source");
    if (this.state.isStreaming) {
      source.setAttribute("src", this.state.streamUrl);
      source.setAttribute("type", "video/mp4");
    } else {
      source.setAttribute("src", this.playlist[this.index]);
      source.setAttribute("type", "video/mp4");
    }

    this.video.appendChild(source);
  };

  setPlaylist = () => {};

  setVideoCanvasContext = () => {
    if (this.canvas && this.canvas.current) {
      this.canvasContext = this.canvas.current.getContext("2d");
    }
  };

  fadeOut = () => {
    if (this.blur < 100) {
      this.blur = this.blur + 5;
    }
    this.updateFilter();
  };

  fadeIn = () => {
    if (this.blur > 5) {
      this.blur = this.blur - 5;
    }
    this.updateFilter();
  };

  updateFilter = () => {
    if (this.canvasContext) {
      this.canvasContext.filter = `blur(${this.blur}%) grayscale${this.grayscale}%}`;
    }
  };

  startPlaylist = () => {
    if (this.video) {
      this.video.currentTime = 0;
    }

    if (this.state.isStreaming) {
      this.setState({
        isStreaming: false
      });
    }

    this.startRender();
  };

  startStream = () => {
    if (!this.state.isStreaming) {
      this.setState({
        isStreaming: true
      });

      this.createVideoElement()
    }

    this.startRender();

  };

  stopPlaylist = () => {
    if (this.animation && this.video) {
      this.video.pause();
      this.setState({
        index: 0
      });
      cancelAnimationFrame(this.animation);
    }
  };

  renderVideoToCanvas = () => {
    if (this.canvasContext && this.video) {
      this.canvasContext.drawImage(
        this.video,
        0,
        0,
        this.state.width,
        this.state.height
      );
    }
  };

  incrementVideoIndex = () => {
    if (this.index + 1 === this.playlist.length) {
      this.index = 0;
    } else {
      this.index = this.index + 1;
    }
  };

  startRender = () => {
    if (this.video) {
      this.video.play();
      let percent = this.video.currentTime / this.video.duration;

      if (percent < 0.05) {
        this.fadeIn();
      }
      this.renderVideoToCanvas();

      if (percent > 0.9) {
        this.fadeOut();
      }

      if (percent >= 0.99) {
        this.incrementVideoIndex();
        this.video.pause();
        this.createVideoElement();
      }

      this.animation = requestAnimationFrame(this.startRender);
    }
  };

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <DivWrapper>
        <canvas
          ref={this.canvas}
          width={this.state.width}
          height={this.state.height}
        />
        <ControlWrapper>
          <ControlText onClick={this.startPlaylist}>Start Playlist</ControlText>
          <ControlText onClick={this.stopPlaylist}>Stop Playlist</ControlText>
          <ControlText>Start Livestream</ControlText>
          <ControlText>Stop Livestream</ControlText>
        </ControlWrapper>
      </DivWrapper>
    );
  }
}
