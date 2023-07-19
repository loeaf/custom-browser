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