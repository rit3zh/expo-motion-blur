require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoMotionBlurView'
  s.version        = package['version']
  s.summary        = 'Metal-powered motion blur for React Native views.'
  s.description    = 'A container view that blurs its children along their on-screen motion, driven by Reanimated, Gesture Handler or anything else that moves it.'
  s.author         = package['author']
  s.license        = package['license']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '16.4',
    :tvos => '16.4'
  }
  s.source         = { git: package['repository'] }
  s.static_framework = true
  s.swift_version  = '5.0'

  s.dependency 'ExpoModulesCore'
  s.frameworks = 'Metal', 'QuartzCore', 'UIKit'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  # Sources are grouped by role: Module, Views, Models, Motion, Rendering and Shaders.
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"

  # Shaders ship as source and are compiled at runtime by MetalContext, so building the app doesn't
  # require Xcode's optional Metal Toolchain.
  s.resources = ['Shaders/**/*.metal']
end
