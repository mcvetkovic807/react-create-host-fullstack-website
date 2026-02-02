import { useParams, useLoaderData } from "react-router-dom";
import axios from "axios";
import CommentsList from "../CommentsList";
import articles from "../article-content";

export default function ArticlePage() {
    const { name } = useParams();
    const { upvotes, comments } = useLoaderData();

    const article = articles.find((a) => a.name === name);

    return (
        <>
        <h1>This is the {article.title} Article Page</h1>
        <p>This article has {upvotes} upvotes</p>
        {article.content.map(p => <p key={p}>{p}</p>)}
        <CommentsList comments={comments} />
        </>
    );
}

export async function loader ({ params }) {
    const response = await axios.get('/api/articles/' + params.name);
    const { upvotes, comments } = response.data;
    return { upvotes, comments };
}