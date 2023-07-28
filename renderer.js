// const { ipcRenderer } = require('electron')
// 키보드 입력
document.addEventListener('keydown', (event) => {
  if(event.key=='F12'){ //F12
    //메인프로세스로 toggle-debug 메시지 전송 (디버그 툴 토글시켜라)
    window.electron.toggleDevTool();
  }
  else if(event.key=='F5'){ //F5
    //메인프로세스로 refresh 메시지 전송 (페이지를 갱신시켜라)
    window.electron.refresh();
  }
})
async function onClicPdf() {
  let folderPath = ''
  folderPath = await window.electron.openFolderDialog() // 로컬 일렉트론
  folderPath = folderPath.replace(/\\/gi, '\\\\')
  if (folderPath) {
    // const folderPath = folderPath.replace(/\\/gi, '\\\\')
    let fileName = 'screenshot_' + moment().format('YYYYMMDD_HHmmss') + '.png'
    await window.electron.appPdf(`${folderPath}\\\\${fileName}`, 'png')
    alert('스크린샷이 저장되었습니다.')
  }
}