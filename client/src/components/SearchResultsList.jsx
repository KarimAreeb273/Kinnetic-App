import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results }) => {

  return (
    <div className="results-list">
      {results.map((result, id) => {
        return (
        <SearchResult result = {result} username={result.username} key={id} id={result.id} />
        )
      })}
    </div>
  );
};