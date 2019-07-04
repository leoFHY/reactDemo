import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import styles from './Editor.less'

const DraftEditor = (props) => {
  return (<Editor toolbarClassName={styles.toolbar} wrapperClassName={styles.wrapper} editorClassName={styles.editor} toolbar={{ image: { uploadCallback: () => { console.log('') } } }}{...props} />)
}

export default DraftEditor
