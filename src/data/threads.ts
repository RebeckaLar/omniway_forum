import { dummyUsers } from "./users";

export const dummyThreads: (Thread | QNAThread)[] = [
	{
		id: 1,
		title: "Testartråden nummer 1",
		category: "THREAD",
		creationDate: "2025-09-01",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis facilis iste aliquam earum itaque rerum veniam eligendi minus dignissimos vitae quidem ex, expedita deserunt obcaecati vero fugit pariatur ipsa est!",
		creator: dummyUsers[0]
	},
	{
		id: 2,
		title: "QNA Testtråd med mer text kommer här",
		category: "QNA",
		creationDate: "2025-09-01",
		description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga voluptas magni doloremque eaque corrupti, labore laborum officia incidunt totam non praesentium tenetur neque libero veritatis at architecto ducimus odit, cupiditate nisi natus ipsa sint repudiandae sed reprehenderit. Modi facere obcaecati illum sint enim, quae ex repellendus repudiandae ab voluptas dolore corrupti error minima earum possimus vel beatae velit! Dolore, dolorum.",
		creator: dummyUsers[1],
		isAnswered: false,
		commentAnswerId: 1
	}
]
