//
//  RNExitApp.m
//  LoveOnline
//
//  Created by Tristate on 27/05/21.
//

#import <Foundation/Foundation.h>


#import <UIKit/UIKit.h>
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif



@interface RNExitApp : NSObject <RCTBridgeModule>
@end

@implementation RNExitApp

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(exitApp)
{
    exit(0);
};

@end
