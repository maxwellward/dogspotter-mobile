import PocketBase from "pocketbase";
const pb = new PocketBase(
	// 'https://8de0-2604-3d08-3483-db00-b8bc-c06f-904a-794c.ngrok-free.app/',
	'https://api.dogspotter.app/',
);

pb.autoCancellation(false);

export default pb;