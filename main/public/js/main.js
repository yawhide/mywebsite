$sidebarContainer = document.querySelector('.sb-container')
$sidebarBtn = $sidebarContainer.querySelector('button')
$highlighter = $sidebarContainer.querySelector('.sb-menu')

$projects = document.querySelectorAll('.listProjectItem')

var projects = {
  'highlight-kik': 'kik',
  'highlight-textnow': 'textnow',
  'highlight-match-3': 'match-3',
  'highlight-projectyawhide': 'projectyawhide',
  'highlight-bonified': 'bonified',
}

$sidebarBtn.onclick = function (){
  if($sidebarContainer.classList.contains('sb-effect'))
    $sidebarContainer.classList.remove('sb-effect')
  else
    $sidebarContainer.classList.add('sb-effect')
}

forEach($projects, function (index, element) {
  console.log(index, element);
  element.onmouseenter = function (){
    $highlighter.classList.add('highlight-' + element.dataset.project)
  }
  element.onmouseleave = function (){
    $highlighter.classList.remove('highlight-' + element.dataset.project)
  }
});


function forEach(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
};
