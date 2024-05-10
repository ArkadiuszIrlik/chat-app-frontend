function ServerImage({ image }: { image: string }) {
  return (
    <div className="relative z-0">
      <div className="profile-img-overlay">
        <img
          src={image}
          alt=""
          className={`relative -z-10 aspect-square rounded-full object-cover object-center ${
            image === '' ? 'bg-gray-800' : ''
          }`}
        />
      </div>
    </div>
  );
}
export default ServerImage;
