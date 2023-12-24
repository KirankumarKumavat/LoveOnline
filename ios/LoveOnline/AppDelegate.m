// #import "AppDelegate.h"

// #import <React/RCTBridge.h>
// #import <React/RCTBundleURLProvider.h>
// #import <React/RCTRootView.h>
// #import "RNSplashScreen.h"  // here
// #import "RNNotifications.h" // here
// #import <FBSDKCoreKit/FBSDKCoreKit.h>
// #import <Firebase.h>
// #ifdef FB_SONARKIT_ENABLED
// // #import <FlipperKit/FlipperClient.h>
// // #import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
// // #import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
// // #import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
// // #import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
// // #import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

// // static void InitializeFlipper(UIApplication *application) {
// //   FlipperClient *client = [FlipperClient sharedClient];
// //   SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
// //   [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
// //   [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
// //   [client addPlugin:[FlipperKitReactPlugin new]];
// //   [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
// //   [client start];
// // }
// #endif

// @implementation AppDelegate

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// {
// #ifdef FB_SONARKIT_ENABLED
//   // InitializeFlipper(application);
// #endif
//   [FIRApp configure];

//   [FBSDKApplicationDelegate.sharedInstance initializeSDK]; // <- add this
//   RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
//   RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
//                                                    moduleName:@"LoveOnline"
//                                             initialProperties:nil];

//   rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

//   self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
//   UIViewController *rootViewController = [UIViewController new];
//   rootViewController.view = rootView;
//   self.window.rootViewController = rootViewController;
//   [self.window makeKeyAndVisible];

//  [RNSplashScreen show];  // here

//   return YES;
// }

// - (BOOL)application:(UIApplication *)application
//             openURL:(NSURL *)url
//   sourceApplication:(NSString *)sourceApplication
//          annotation:(id)annotation {
//   return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                         openURL:url
//                                               sourceApplication:sourceApplication
//                                                      annotation:annotation];
// }
// // - (void)applicationDidBecomeActive:(UIApplication *)application {
// // //  [FBSDKAppEvents activateApp];
// //    [FBSDKAppEvents accessibilityActivate];
// // }

// - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//   [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
// }

// - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
//   [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
// }

// - (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
//   [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
// }

// - (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
// {
// #if DEBUG
//   return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
// #else
//   return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
// #endif
// }

// @end

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import <React/RCTAppSetupUtils.h>

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNSplashScreen.h"  // here
#import <Firebase.h> // here
#import "RNNotifications.h" // here

#if RCT_NEW_ARCH_ENABLED
#import <React/CoreModulesPlugins.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>
#import <ReactCommon/RCTTurboModuleManager.h>

#import <react/config/ReactNativeConfig.h>

@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
  RCTTurboModuleManager *_turboModuleManager;
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
}
@end
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {

  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
    openURL:url
    sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
    annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
  ];
  // Add any custom logic here.
  return handled;
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNNotifications startMonitorNotifications];
  [FBSDKApplicationDelegate.sharedInstance initializeSDK]; // <- add this

  RCTAppSetupPrepareApp(application);

  [[FBSDKApplicationDelegate sharedInstance] application:application
                         didFinishLaunchingWithOptions:launchOptions];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

#if RCT_NEW_ARCH_ENABLED
  _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
  _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
  _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:bridge contextContainer:_contextContainer];
  bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;
#endif

  UIView *rootView = RCTAppSetupDefaultRootView(bridge, @"LoveOnline", nil);

  if (@available(iOS 13.0, *)) {
    rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
    rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [RNSplashScreen show];  // here
  
  return YES;
}
//- (void)applicationDidBecomeActive:(UIApplication *)application {
//  [FBSDKAppEvents activateApp];
//}
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [RNNotifications didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  [RNNotifications didFailToRegisterForRemoteNotificationsWithError:error];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult result))completionHandler {
  [RNNotifications didReceiveBackgroundNotification:userInfo withCompletionHandler:completionHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#if RCT_NEW_ARCH_ENABLED

#pragma mark - RCTCxxBridgeDelegate

- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge
                                                             delegate:self
                                                            jsInvoker:bridge.jsCallInvoker];
  return RCTAppSetupDefaultJsExecutorFactory(bridge, _turboModuleManager);
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return RCTCoreModulesClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return nullptr;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                     initParams:
                                                         (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return nullptr;
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  return RCTAppSetupDefaultModuleFromClass(moduleClass);
}

#endif

@end

