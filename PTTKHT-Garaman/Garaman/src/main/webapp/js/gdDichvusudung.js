const prevButton = useSelector(".prevPage")
const nextButton = useSelector(".nextPage")

prevButton.onclick = (e) => {
    e.preventDefault()
    const page = new URL(prevButton.href).searchParams.get("page")
    if (page == null) {
        return
    }
    const queryURL = new URLSearchParams(location.search)
    queryURL.set("page", page)
    const url = new URL(location)
    url.search = queryURL.toString()
    location.href = url
}

nextButton.onclick = (e) => {
    e.preventDefault()
    const page = new URL(nextButton.href).searchParams.get("page")
    if (page == null) {
        return
    }
    const queryURL = new URLSearchParams(location.search)
    queryURL.set("page", page)
    const url = new URL(location)
    url.search = queryURL.toString()
    location.href = url
}
