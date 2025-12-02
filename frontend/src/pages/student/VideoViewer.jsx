import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StudentLayout from '../../components/StudentLayout';
import { videoService } from '../../services';
import { FiDownload, FiExternalLink, FiArrowLeft } from 'react-icons/fi';

const VideoViewer = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await videoService.getVideoById(id);
      setVideo(response.data.video);
    } catch (error) {
      console.error('Error fetching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading video...</div>
        </div>
      </StudentLayout>
    );
  }

  if (!video) {
    return (
      <StudentLayout>
        <div className="card text-center py-12">
          <p className="text-gray-600">Video not found.</p>
          <Link to="/videos" className="btn-primary mt-4 inline-block">
            Back to Videos
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <Link to="/videos" className="flex items-center text-primary-600 hover:text-primary-700">
          <FiArrowLeft className="mr-2" />
          Back to Video Library
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-black rounded-lg overflow-hidden">
              <iframe
                className="w-full aspect-video"
                src={getYouTubeEmbedUrl(video.videoUrl)}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                      {video.category}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {video.language}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full">
                      {video.difficulty}
                    </span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{video.description}</p>

              {video.topics && video.topics.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Topics Covered:</h3>
                  <div className="flex flex-wrap gap-2">
                    {video.topics.map((topic, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Downloadable Files */}
            {video.downloadableFiles && video.downloadableFiles.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Downloadable Materials</h3>
                <div className="space-y-2">
                  {video.downloadableFiles.map((file, index) => (
                    <a
                      key={index}
                      href={file.fileUrl}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiDownload className="mr-3 text-primary-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{file.fileName}</p>
                        <p className="text-xs text-gray-500">{file.fileType.toUpperCase()}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* External Links */}
            {video.externalLinks && video.externalLinks.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Additional Resources</h3>
                <div className="space-y-2">
                  {video.externalLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink className="mr-3 text-primary-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{link.title}</p>
                        <p className="text-xs text-gray-500">{link.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default VideoViewer;
