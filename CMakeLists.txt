cmake_minimum_required(VERSION 3.11)
project(MazeOfGalious)
list(APPEND CMAKE_MODULE_PATH ${CMAKE_SOURCE_DIR}/cmake)

set(MOG_VERSION "0.63")

set(SHARED_SOURCES
	sources/MOGtypes.h
	sources/bitmaps.cpp
	sources/bitmaps.h
	sources/debug.cpp
	sources/debug.h
	sources/debug-report.cpp
	sources/demons.cpp
	sources/drawing.cpp
	sources/drawing.h
	sources/filehandling.cpp
	sources/filehandling.h
	sources/gameaux.cpp
	sources/gamecycle.cpp
	sources/gameinteractions.cpp
	sources/gameobjects.cpp
	sources/gametiles.cpp
	sources/ingamecycle.cpp
	sources/keyboard.cpp
	sources/line_clip.cpp
	sources/line_clip.h
	sources/loadpcx.cpp
	sources/loadpcx.h
	sources/main.cpp
	sources/mog.h
	sources/object.h
	sources/passwords.cpp
	sources/path.cpp
	sources/render.cpp
	sources/resource.h
	sources/roomchange.cpp
	sources/shrines.cpp
	sources/sound.cpp
	sources/sound.h
	sources/sprites.h
	sources/tiles.h
)

set(MAC_SOURCES
	"build/osx/Maze of Galious/SDLMain.h"
	"build/osx/Maze of Galious/SDLMain.m"
)

set(SHARED_LIBS
)

if (APPLE)
	set(CMAKE_OSX_DEPLOYMENT_TARGET ${MACOSX_DEPLOYMENT_TARGET})
	if (MACOSX_DEPLOYMENT_TARGET)
		set(CMAKE_OSX_SYSROOT "/Library/Developer/CommandLineTools/SDKs/MacOSX${MACOSX_DEPLOYMENT_TARGET}.sdk")
	else()
		set(CMAKE_OSX_SYSROOT "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk")
	endif()
	set(CMAKE_CXX_FLAGS "--sysroot \"${CMAKE_OSX_SYSROOT}\" ${CMAKE_CXX_FLAGS}")
endif()

find_package(SDL REQUIRED)
find_package(SDL_image REQUIRED)
find_package(SDL_mixer REQUIRED)
find_package(SDL_sound REQUIRED)

include_directories(.)

if (SDL_FOUND)
	include_directories(${SDL_INCLUDE_DIRS} ${SDL_INCLUDE_DIR})
	set(SHARED_SOURCES ${SHARED_SOURCES} ${SDL_SOURCES})
	set(SHARED_LIBS ${SHARED_LIBS} ${SDL_LIBRARIES})
endif()

if (SDL_IMAGE_FOUND)
	include_directories(${SDL_IMAGE_INCLUDE_DIRS})
	set(SHARED_SOURCES ${SHARED_SOURCES} ${SDL_IMAGE_SOURCES})
	set(SHARED_LIBS ${SHARED_LIBS} ${SDL_IMAGE_LIBRARIES})
endif()

if (SDL_MIXER_FOUND)
	include_directories(${SDL_MIXER_INCLUDE_DIRS})
	set(SHARED_SOURCES ${SHARED_SOURCES} ${SDL_MIXER_SOURCES})
	set(SHARED_LIBS ${SHARED_LIBS} ${SDL_MIXER_LIBRARIES})
endif()

if (SDL_SOUND_FOUND)
	include_directories(${SDL_SOUND_INCLUDE_DIR})
	set(SHARED_SOURCES ${SHARED_SOURCES} ${SDL_SOUND_SOURCES})
	set(SHARED_LIBS ${SHARED_LIBS} ${SDL_SOUND_LIBRARIES})
endif()

if (APPLE)
	source_group("macos" REGULAR_EXPRESSION "${CMAKE_CURRENT_SOURCE_DIR}/build/osx/Maze of Galious/SDLMain.+")
	set(MoGIcon "${CMAKE_CURRENT_SOURCE_DIR}/build/osx/Maze of Galious.icns")
	set_source_files_properties(${MoGIcon} PROPERTIES MACOSX_PACKAGE_LOCATION "Resources")
	file(GLOB_RECURSE GRAPHICS_RES "${CMAKE_CURRENT_SOURCE_DIR}/graphics/*")
	file(GLOB_RECURSE ROOMS_RES "${CMAKE_CURRENT_SOURCE_DIR}/rooms/*")
	file(GLOB_RECURSE SOUND_RES "${CMAKE_CURRENT_SOURCE_DIR}/sound/*")
	add_executable(MazeOfGalious MACOSX_BUNDLE ${MoGIcon} ${SHARED_SOURCES} "${MAC_SOURCES}" "${GRAPHICS_RES}" "${ROOMS_RES}" "${SOUND_RES}")

	foreach(GRAPHICS_RES_FILE ${GRAPHICS_RES})
		file(RELATIVE_PATH GRAPHICS_RES_PATH "${CMAKE_CURRENT_SOURCE_DIR}/graphics" ${GRAPHICS_RES_FILE})
		string(REGEX REPLACE "/[^/]*$" "" GRAPHICS_RES_PATH_STRIPPED ${GRAPHICS_RES_PATH})
		set_property(SOURCE ${GRAPHICS_RES_FILE} PROPERTY MACOSX_PACKAGE_LOCATION "Resources/graphics/${GRAPHICS_RES_PATH_STRIPPED}")
	endforeach(GRAPHICS_RES_FILE)

	foreach(ROOMS_RES_FILE ${ROOMS_RES})
		set_property(SOURCE ${ROOMS_RES_FILE} PROPERTY MACOSX_PACKAGE_LOCATION "Resources/rooms")
	endforeach(ROOMS_RES_FILE)

	foreach(SOUND_RES_FILE ${SOUND_RES})
		file(RELATIVE_PATH SOUND_RES_PATH "${CMAKE_CURRENT_SOURCE_DIR}/sound" ${SOUND_RES_FILE})
		string(REGEX REPLACE "/[^/]*$" "" SOUND_RES_PATH_STRIPPED ${SOUND_RES_PATH})
		set_property(SOURCE ${SOUND_RES_FILE} PROPERTY MACOSX_PACKAGE_LOCATION "Resources/sound/${SOUND_RES_PATH_STRIPPED}")
	endforeach(SOUND_RES_FILE)

	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_BUNDLE_NAME "Maze of Galious")
	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_EXECUTABLE_NAME "${MACOSX_BUNDLE_BUNDLE_NAME}")
	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_INFO_PLIST "${CMAKE_CURRENT_SOURCE_DIR}/build/osx/Info.plist.in")
	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_ICON_FILE "Maze of Galious.icns")
	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_GUI_IDENTIFIER "com.braingames.MazeofGalious")
	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_SHORT_VERSION_STRING "${MOG_VERSION}")
	set_target_properties(MazeOfGalious PROPERTIES MACOSX_BUNDLE_BUNDLE_VERSION "${MACOSX_BUNDLE_BUNDLE_NAME} ${MOG_VERSION}")
	set_target_properties(MazeOfGalious PROPERTIES OUTPUT_NAME "Maze of Galious")
	if(EXISTS "/usr/local/bin/dylibbundler")
		add_custom_command(TARGET MazeOfGalious POST_BUILD COMMAND /bin/zsh -c "/usr/local/bin/dylibbundler -od -b -x \"${CMAKE_CURRENT_SOURCE_DIR}/Maze of Galious.app/Contents/MacOS/Maze of Galious\" -d \"${CMAKE_CURRENT_SOURCE_DIR}/Maze of Galious.app/Contents/libs\"")
	elseif(EXISTS "/opt/homebrew/bin/dylibbundler")
		add_custom_command(TARGET MazeOfGalious POST_BUILD COMMAND /bin/zsh -c "/opt/homebrew/bin/dylibbundler -od -b -x \"${CMAKE_CURRENT_SOURCE_DIR}/Maze of Galious.app/Contents/MacOS/Maze of Galious\" -d \"${CMAKE_CURRENT_SOURCE_DIR}/Maze of Galious.app/Contents/libs\"")
	endif()
else()
	add_executable(MazeOfGalious WIN32 ${SHARED_SOURCES})
endif()

target_link_libraries(MazeOfGalious ${SHARED_LIBS})

source_group("shared" REGULAR_EXPRESSION "${CMAKE_CURRENT_SOURCE_DIR}/sources/.+")
