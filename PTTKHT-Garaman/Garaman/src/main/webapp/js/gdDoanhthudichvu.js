const fromInput = useSelector("[name='start']")
const toInput = useSelector("[name='end']")
const submitButton = useSelector(".xem-TK")
const prevButton = useSelector(".prevPage")
const nextButton = useSelector(".nextPage")

{
    const url = new URL(location.href);
    const fromParam = url.searchParams.get("from");
    if (fromParam) {
        fromInput.value = new Date(+fromParam).toLocaleDateString('en');
    } else {
        fromInput.value = "";
    }
    const toParam = url.searchParams.get("to");
    if (toParam) {
        toInput.value = new Date(+toParam).toLocaleDateString('en');
    } else {
        toInput.value = "";
    }
}

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

submitButton.onclick = () => {
    const queryURL = new URLSearchParams(location.search)
    queryURL.set("from", Date.parse(fromInput.value))
    queryURL.set("to", Date.parse(toInput.value))
    const url = new URL(location)
    url.search = queryURL.toString()
    location.href = url
}

const dichvuLinks = useSelectorAll("[href^='/dichvusudung']")
dichvuLinks.forEach(dichvu => {
    dichvu.onclick = (e) => {
        e.preventDefault()
        const id = new URL(dichvu.href).searchParams.get("id")
        const queryURL = new URLSearchParams(location.search)
        queryURL.set("id", id)
        queryURL.delete("page")
        const url = new URL(location.origin + "/dichvusudung")
        url.search = queryURL.toString()
        location.href = url
    }
})
