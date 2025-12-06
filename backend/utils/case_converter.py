"""
Utility functions for converting between camelCase and snake_case.
"""
import re
from typing import Any, Dict


def camel_to_snake(name: str) -> str:
    """
    Convert a camelCase string to snake_case.
    
    Args:
        name: String in camelCase format
        
    Returns:
        String in snake_case format
    """
    # Insert underscore before uppercase letters and convert to lowercase
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()


def snake_to_camel(name: str) -> str:
    """
    Convert a snake_case string to camelCase.
    
    Args:
        name: String in snake_case format
        
    Returns:
        String in camelCase format
    """
    components = name.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def convert_dict_keys_to_snake(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert all keys in a dictionary from camelCase to snake_case.
    Handles nested dictionaries and lists.
    
    Args:
        data: Dictionary with camelCase keys
        
    Returns:
        Dictionary with snake_case keys
    """
    if not isinstance(data, dict):
        return data
    
    result = {}
    for key, value in data.items():
        new_key = camel_to_snake(key)
        
        if isinstance(value, dict):
            result[new_key] = convert_dict_keys_to_snake(value)
        elif isinstance(value, list):
            result[new_key] = [
                convert_dict_keys_to_snake(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            result[new_key] = value
    
    return result


def convert_dict_keys_to_camel(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convert all keys in a dictionary from snake_case to camelCase.
    Handles nested dictionaries and lists.
    
    Args:
        data: Dictionary with snake_case keys
        
    Returns:
        Dictionary with camelCase keys
    """
    if not isinstance(data, dict):
        return data
    
    result = {}
    for key, value in data.items():
        new_key = snake_to_camel(key)
        
        if isinstance(value, dict):
            result[new_key] = convert_dict_keys_to_camel(value)
        elif isinstance(value, list):
            result[new_key] = [
                convert_dict_keys_to_camel(item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            result[new_key] = value
    
    return result
