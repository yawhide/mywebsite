$sidebarContainer = document.querySelector('.sb-container')
$sidebar = $sidebarContainer.querySelector('.sideBar')
$sidebarBtn = $sidebarContainer.querySelector('button')
$highlighter = $sidebarContainer.querySelector('.sb-menu')

$projects = document.querySelectorAll('.listProjectItem')

var projects = {
  'highlight-kik': 'kik',
  'highlight-textnow': 'textnow',
  'highlight-match-3': 'match-3',
  'highlight-projectsobeys': 'projectsobeys',
  'highlight-bonified': 'bonified',
  'highlight-hop': 'hop',
  'highlight-htn': 'htn',
  'highlight-surveyhide': 'surveyhide',
}

$sidebarBtn.onclick = function (){
  if($sidebarContainer.classList.contains('sb-effect'))
    $sidebarContainer.classList.remove('sb-effect')
  else
    $sidebarContainer.classList.add('sb-effect')
}

forEach($projects, function (index, element) {
  if (element.dataset.project){
    element.onmouseenter = function (){
      $highlighter.classList.add('highlight-' + element.dataset.project)
    }
    element.onmouseleave = function (){
      $highlighter.classList.remove('highlight-' + element.dataset.project)
    }
    element.onclick = function (){
      ga('send', 'event', 'button', 'click', element.dataset.project);
      if(element.dataset && element.dataset.url)
        window.open(element.dataset.url, '_blank')
    }
  }
});

document.onscroll = function (){
  if(window.innerWidth > 830){
    if(window.pageYOffset > 106)
      $sidebar.classList.add('sticky-sidebar')
    else
      $sidebar.classList.remove('sticky-sidebar')
  }
}

function forEach(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};
