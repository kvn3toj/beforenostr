import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Badge,
  Tooltip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavigationItem[];
  badge?: number | string;
  disabled?: boolean;
  divider?: boolean;
  category?: string;
}

export interface NavigationMenuProps {
  items: NavigationItem[];
  collapsed?: boolean;
  onItemClick?: (item: NavigationItem) => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  items,
  collapsed = false,
  onItemClick,
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(item.id)) {
        newExpanded.delete(item.id);
      } else {
        newExpanded.add(item.id);
      }
      setExpandedItems(newExpanded);
    } else if (item.path) {
      navigate(item.path);
      onItemClick?.(item);
    }
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.path) {
      return location.pathname === item.path || 
             (item.path !== '/' && location.pathname.startsWith(item.path));
    }
    return false;
  };

  const hasActiveChild = (item: NavigationItem): boolean => {
    if (!item.children) return false;
    return item.children.some(child => 
      isItemActive(child) || hasActiveChild(child)
    );
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const hasActiveDescendant = hasActiveChild(item);

    const listItemContent = (
      <ListItemButton
        onClick={() => handleItemClick(item)}
        disabled={item.disabled}
        sx={{
          pl: 2 + level * 2,
          pr: 2,
          py: 1,
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          minHeight: 48,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '& .MuiListItemIcon-root': {
              color: 'primary.contrastText',
            },
          },
          '&:hover': {
            backgroundColor: isActive ? 'primary.dark' : 'action.hover',
          },
          ...(hasActiveDescendant && !isActive && {
            backgroundColor: 'action.selected',
          }),
        }}
        selected={isActive}
      >
        <ListItemIcon
          sx={{
            minWidth: collapsed ? 0 : 40,
            mr: collapsed ? 0 : 1,
            justifyContent: 'center',
            color: isActive ? 'inherit' : 'text.secondary',
          }}
        >
          {level > 0 ? (
            <CircleIcon sx={{ fontSize: 8 }} />
          ) : (
            item.icon
          )}
        </ListItemIcon>

        {!collapsed && (
          <>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  fontWeight={isActive ? 600 : 400}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Typography>
              }
            />

            {item.badge && (
              <Badge
                badgeContent={item.badge}
                color="error"
                sx={{ mr: 1 }}
              />
            )}

            {hasChildren && (
              isExpanded ? <ExpandLess /> : <ExpandMore />
            )}
          </>
        )}
      </ListItemButton>
    );

    const wrappedContent = collapsed && item.label ? (
      <Tooltip title={item.label} placement="right" arrow>
        {listItemContent}
      </Tooltip>
    ) : (
      listItemContent
    );

    return (
      <React.Fragment key={item.id}>
        {item.divider && level === 0 && (
          <Divider sx={{ my: 1, mx: 2 }} />
        )}
        
        {item.category && level === 0 && !collapsed && (
          <Typography
            variant="overline"
            sx={{
              px: 3,
              py: 1,
              color: 'text.secondary',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            {item.category}
          </Typography>
        )}

        <ListItem disablePadding>
          {wrappedContent}
        </ListItem>

        {hasChildren && isExpanded && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderNavigationItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Items */}
      <List
        component="nav"
        sx={{
          flexGrow: 1,
          py: 2,
          '& .MuiListItemButton-root': {
            borderRadius: 1,
          },
        }}
      >
        {items.map(item => renderNavigationItem(item))}
      </List>
    </Box>
  );
}; 