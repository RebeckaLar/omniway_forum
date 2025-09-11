type ThreadCategory = "NoCategory" | "QNA" | "Diskussion" | "Meddelande" | "Hitta gruppmedlem";

type ThreadCategoryType = Thread | QNAThread

type User = {
	id: number;
	userName: string;
	password: string;
	isModerator: boolean;
}

// Update users array in concsole:
// let users = JSON.parse(localStorage.getItem("@forum/users") || "[]");
// users = users.map(u =>
//   u.userName === "Danne" ? { ...u, isModerator: true } : u
// );
// localStorage.setItem("@forum/users", JSON.stringify(users));

// Update currentUser in console:
// let currentUser = JSON.parse(localStorage.getItem("@forum/currentUser") || "{}");
// if (currentUser?.userName === "Danne") {
//   currentUser.isModerator = true;
//   localStorage.setItem("@forum/currentUser", JSON.stringify(currentUser));
// }

//console.log("Danne is now a moderator");

type Thread = {
	id: number;
	title: string;
	category: ThreadCategory;
	creationDate: string;
	description: string;
	creator: User;
	commentsLocked?: boolean;
}

type QNAThread = Thread & { //Type extension
	category: "QNA";
	isAnswered: boolean;
	commentAnswerId?: number;
}

type ForumComment = {
	id: number;
	thread: number;
	content: string;
	creator: User;
	comment?: number;
}
