function setup() {
  if (Action.preferences.TemplateDir) return;
  const templateDir = `${LaunchBar.homeDirectory}/Library/Templates`;
  if (!File.exists(templateDir)) File.createDirectory(templateDir);

  Action.preferences.TemplateDir = templateDir;
}

function run(arg) {
  setup();

  const templateDir = Action.preferences.TemplateDir;

  let list = [];

  if (File.exists(templateDir) && File.isDirectory(templateDir) && File.isReadable(templateDir)) {
    const templates = File.getDirectoryContents(templateDir);

    templates.forEach((filename) => {
      let obj = {
        title: filename,
        action: 'newfile',
        actionArgument: filename,
        actionReturnsItems: 1
      };
      list.push(obj);
    });
    return list;
  }
}

function newfile(template) {
  let currentDir = LaunchBar.executeAppleScript('tell application "Finder" to get POSIX path of (get insertion location as text)');
  currentDir = currentDir.trim('\n');

  let templatePath = `${Action.preferences.TemplateDir}/${template}`;

  let extension = template.indexOf('.') > 0 ? `.${template.split('.').pop()}` : '';

  let newFilePath = `${currentDir}untitled${extension}`;

  if (File.exists(newFilePath)) {
    let x = 1;
    while (true) {
      newFilePath = `${currentDir}untitled${x}${extension}`;
      if (!File.exists(newFilePath)) break;
      x++;
    }
  }
  try {
    LaunchBar.execute('/bin/cp', '-r', templatePath, newFilePath);
    return [{ path: newFilePath }];
  } catch {
    return [
      {
        title: 'ERROR!',
        subtitle: "Can't create file."
      }
    ];
  }
}
