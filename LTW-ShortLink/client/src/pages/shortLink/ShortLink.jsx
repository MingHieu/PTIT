import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createClick, getDetailLinkByCode } from '../../api/api'

const ShortLink = () => {
  const { code } = useParams()

  useEffect(() => {
    getDetailLinkByCode(code).then((res) => {
      createClick(
        {
          linkId: res.data.id
        },
        location.search
      )
      location.replace(res.data.url)
    })
  }, [])

  return <div></div>
}

export default ShortLink
