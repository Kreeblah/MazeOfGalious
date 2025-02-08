# Distributed under the OSI-approved BSD 3-Clause License.  See accompanying
# file Copyright.txt or https://cmake.org/licensing for details.

#[=======================================================================[.rst:
FindHomebrew
------------

Locates the user's Homebrew prefix



This module defines

::

  HOMEBREW_PREFIX, the Homebrew prefix
#]=======================================================================]

if(IS_READABLE /opt/homebrew/Library/Homebrew)
    set(HOMEBREW_PREFIX /opt/homebrew)
elseif(IS_READABLE /usr/local/Library/Homebrew)
    set(HOMEBREW_PREFIX /usr/local)
endif()
