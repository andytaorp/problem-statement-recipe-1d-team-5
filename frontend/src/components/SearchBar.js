function SearchBar({ searchQuery, setSearchQuery }) {

    return (
        <div className="search-bar">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                placeholder="Search items..."
            />
        </div>
    )
}

export default SearchBar;