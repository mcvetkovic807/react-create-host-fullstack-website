import { useParams } from "react-router-dom";
import articles from "../article-content";

export default function ArticlePage() {
    const { name } = useParams();

    const article = articles.find((a) => a.name === name);

    return (
        <>
        <h1>This is the {article.title} Article Page</h1>
        {article.content.map(p => <p key={p}>{p}</p>)}
        </>
    );
}