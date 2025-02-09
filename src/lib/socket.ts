import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:4000";
const socket: Socket = io(SOCKET_URL);

export default socket;
