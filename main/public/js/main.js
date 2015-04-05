$sidebarContainer = document.querySelector('.sb-container')
$sidebarBtn = $sidebarContainer.querySelector('button')

$sidebarBtn.onclick = function (){
  if($sidebarContainer.classList.contains('sb-effect'))
    $sidebarContainer.classList.remove('sb-effect')
  else
    $sidebarContainer.classList.add('sb-effect')


}

function closeSideBar(){


  $sidebarContainer.classList
}
