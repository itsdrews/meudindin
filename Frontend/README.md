

>> Node v22.17.0 - Versão do compilador

>> npm install pnpm  -- gerenciador de pacotes pnpm para deixar mais leve


** Importante** Método alternativo para não precisar usar a IDE Android Studio
>> baixe o Android command line tools - latest
>> crie o diretório C:\Android
>> extraia C:Android\cmdline_tools
>> crie a pasta latest dentro de cmdline tools
>> mova o conteúdo (bin,lib,etc)
>> Edite as variáveis de ambiente e crie uma nova variável "ANDROID_HOME" com valor C:\Android
>> Edite a variável Path e adicione 
      %ANDROID_HOME%\cmdline-tools\latest\bin
      %ANDROID_HOME%\platform-tools
      %ANDROID_HOME%\emulator 
>> uma de cada vez
>> reinicie o sistema, abra o terminal e teste com sdkmanager --list  
>> sdkmanager "platform-tools" "emulator" para baixar o emulador de Android usando o SDK Manager
>> istale ferramentas adicionais:  sdkmanager "platforms;android-34" "system-images;android-34;google_apis;x86_64"
>> crie um emulador:  avdmanager create avd -n MeuEmulador -k "system-images;android-34;google_apis;x86_64" -d pixel_4
>> inicializando react-native : npx @react-native-community/cli init 






