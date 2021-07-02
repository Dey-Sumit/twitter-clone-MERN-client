import { useSocketState } from "@context/socket.context";

const notifications = () => {
 
 

  return (
    <div>
      notis
      <button className="button" onClick={notify}>
        Notify
      </button>
      {/* {socket?.id}
      {JSON.stringify(socket)} */}
    </div>
  );
};

export default notifications;
